import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Candidate } from "../models/candidate.model.js";
import { isValidObjectId } from "mongoose";
import { VotingStatus } from "../models/votingStatus.model.js";

const createCandidate = asyncHandler(async (req, res) => {
  const { name, party, age } = req.body;
  if (!name) {
    throw new ApiError(400, "Candidate name is required");
  }
  if (!party) {
    throw new ApiError(400, "Candidate party is required");
  }
  if (!age) {
    throw new ApiError(400, "Candidate age is required");
  }

  const existedCandidate = await Candidate.findOne({
    $or: [{ name }, { party }],
  });
  if (existedCandidate) {
    throw new ApiError(400, "Candidate with this name or party already exists");
  }

  const candidate = await Candidate.create({
    name,
    party,
    age,
    votes: [],
    votesCount: 0,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, candidate, "Candidate created successfully"));
});

const updateCandidate = asyncHandler(async (req, res) => {
  const { candidateId } = req.params;
  const { name, party, age } = req.body;

  if (!isValidObjectId(candidateId)) {
    throw new ApiError(400, "invalid candidate id");
  }
  if (!(name || party || age)) {
    throw new ApiError(400, "At least one field is required to update");
  }

  const candidate = await Candidate.findByIdAndUpdate(
    candidateId,
    {
      $set: {
        name: name,
        party: party,
        age: age,
      },
    },
    { new: true }
  );
  if (!candidate) {
    throw new ApiError(404, "candidate not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, candidate, "candidate updated successfully"));
});

const deleteCandidate = asyncHandler(async (req, res) => {
  const { candidateId } = req.params;
  if (!isValidObjectId(candidateId)) {
    throw new ApiError(400, "invalid candidate id");
  }

  const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);

  if (!deletedCandidate) {
    throw new ApiError(404, "Candidate not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Candidate removed successfully"));
});

const getAllCandidates = asyncHandler(async (req, res) => {
  const candidate = await Candidate.find().select("name party age");
  return res
    .status(200)
    .json(new ApiResponse(200, candidate, "List of candidates"));
});

const getCandidateById = asyncHandler(async (req, res) => {
  const { candidateId } = req.params;

  // Validate candidate id
  if (!isValidObjectId(candidateId)) {
    throw new ApiError(400, "Invalid candidate id");
  }

  const candidate = await Candidate.findById(candidateId);
  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, candidate, "Candidate fetched successfully"));
});

const voteForCandidate = asyncHandler(async (req, res) => {
  const { candidateId } = req.params;
  if (!isValidObjectId(candidateId)) {
    throw new ApiError(400, "invalid candidate id");
  }

  const votingStatus = await VotingStatus.findOne();
  if (!votingStatus || !votingStatus.isVotingOpen) {
    throw new ApiError(403, "Voting is currently closed. You cannot vote.");
  }

  const candidate = await Candidate.findById(candidateId);
  if (!candidate) {
    throw new ApiError(404, "candidate not found");
  }

  const alreadyVoted = candidate.votes.find(
    (v) => v.user.toString() === req.user._id.toString()
  );
  if (alreadyVoted) {
    throw new ApiError(400, "You have already voted for this candidate");
  }

  candidate.votes.push({
    user: req.user._id,
  });
  candidate.voteCount = candidate.votes.length;
  await candidate.save();

  return res
    .status(200)
    .json(new ApiResponse(200, candidate, "Vote submitted successfully"));
});

const votesCount = asyncHandler(async (req, res) => {
  const candidates = await Candidate.find().select("name party voteCount");

  if (!candidates || candidates.length === 0) {
    throw new ApiError(404, "No candidates found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, candidates, "Vote counts fetched successfully"));
});

export {
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getAllCandidates,
  voteForCandidate,
  getCandidateById,
  votesCount,
};
