import { VotingStatus } from "../models/votingStatus.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const openVoting = asyncHandler(async (req, res) => {
    const votingStatus = await VotingStatus.findOneAndUpdate(
        {}, 
        { isVotingOpen: true },
        { new: true, upsert: true } // upsert: create a new document if none exists
    )
    return res
    .status(200)
    .json(new ApiResponse(
        200, votingStatus, "Voting has been opened successfully"
    ))
})

const closeVoting = asyncHandler(async (req, res) => {
    const votingStatus = await VotingStatus.findOneAndUpdate(
        {}, 
        { isVotingOpen: false },
        { new: true, upsert: true } 
    )
    return res
    .status(200)
    .json(new ApiResponse(
        200, votingStatus, "Voting has been closed successfully"
    ))
})

const getVotingStatus = asyncHandler(async(req, res) => {
    const votingStatus = await VotingStatus.findOne({}) // there should be only one document
    if (!votingStatus) {
        throw new ApiError(404, "Voting status not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(
        200, votingStatus, "Voting status fetched successfully"
    ))
})

export {
    openVoting,
    closeVoting,
    getVotingStatus
}