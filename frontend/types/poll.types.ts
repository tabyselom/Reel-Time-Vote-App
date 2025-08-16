export interface Poll {
  id?: string;
  question: string;
  options: string[];
}

export interface PoolDetail {
  id: string;
  Option: Option[];
  question: string;
  userId: string;
  isActive: boolean;
  created_at: Date;
}
export interface Option {
  id: string;
  pollId: string;
  text: string;
  votesCount: number;
}

export type PollStoreType = {
  poll: PoolDetail | null;
  myPolls: PoolDetail[] | null;
  isCreatingPoll: boolean;
  isFetchingPolls: boolean;
  isVotingPoll: boolean;
  hasVoted: boolean;

  CreatePoll: (data: Poll) => void;
  GetPoll: (id: string) => void;
  VotePoll: (id: string) => void;
  GetMyPoll: () => void;
};
