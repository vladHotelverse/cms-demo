export interface ProposalItem {
  id: string
  name: string
  description?: string
  price: number
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  createdAt: Date
  expiresAt: Date
  metadata?: Record<string, any>
}

export interface OrderStorage {
  proposals: ProposalItem[]
  lastUpdate: Date
}

// Mock storage - in real app this would connect to an API
let mockStorage: OrderStorage = {
  proposals: [],
  lastUpdate: new Date(),
}

export async function updateProposalStatus(
  proposalId: string,
  status: ProposalItem['status']
): Promise<void> {
  const proposal = mockStorage.proposals.find(p => p.id === proposalId)
  if (proposal) {
    proposal.status = status
    mockStorage.lastUpdate = new Date()
  }
}

export async function getProposals(): Promise<ProposalItem[]> {
  return mockStorage.proposals
}

export async function addProposal(proposal: Omit<ProposalItem, 'id' | 'createdAt'>): Promise<string> {
  const newProposal: ProposalItem = {
    ...proposal,
    id: `proposal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
  }
  
  mockStorage.proposals.push(newProposal)
  mockStorage.lastUpdate = new Date()
  
  return newProposal.id
}

export async function removeProposal(proposalId: string): Promise<void> {
  mockStorage.proposals = mockStorage.proposals.filter(p => p.id !== proposalId)
  mockStorage.lastUpdate = new Date()
}

export async function clearExpiredProposals(): Promise<void> {
  const now = new Date()
  mockStorage.proposals = mockStorage.proposals.filter(p => p.expiresAt > now)
  mockStorage.lastUpdate = new Date()
}