import mongoose, { Schema } from "mongoose";

const votingStatusSchema = new Schema(
  {
    isVotingOpen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const VotingStatus  = mongoose.model("VotingStatus", votingStatusSchema)