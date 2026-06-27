// @req SCD-DET-001
import { render, screen } from '@testing-library/react';
import type { RequirementDetail } from '@/lib/api/types';
import { RequirementDetail as RequirementDetailView } from './RequirementDetail';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/requirements/FR-SCAN-001',
  useSearchParams: () => new URLSearchParams(),
}));

const requirement: RequirementDetail = {
  id: 'FR-SCAN-001',
  type: 'FR',
  title: 'Parse requirements.yaml',
  description: 'System MUST read requirements.yaml from repository root.',
  status: 'covered',
  createdAt: '2026-02-10T09:00:00Z',
  updatedAt: '2026-02-28T14:30:00Z',
  annotations: [
    {
      file: 'src/parser.rs',
      line: 15,
      reqId: 'FR-SCAN-001',
      type: 'impl',
      snippet: '/// @req FR-SCAN-001\nfn parse_requirements() {',
    },
  ],
  tasks: [
    {
      id: 'TASK-001',
      requirementId: 'FR-SCAN-001',
      title: 'Implement YAML parser',
      status: 'done',
      assignee: 'alexey',
      createdAt: '2026-02-10T09:00:00Z',
      updatedAt: '2026-02-20T18:00:00Z',
    },
  ],
};

describe('RequirementDetail', () => {
  it('shows metadata, annotations, and linked tasks', () => {
    render(<RequirementDetailView requirement={requirement} />);

    expect(
      screen.getByRole('heading', { level: 1, name: requirement.title }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/coverage assessment/i)).toHaveTextContent(
      'Fully covered',
    );
    expect(screen.getByText('Linked annotations')).toBeInTheDocument();
    expect(screen.getByText('src/parser.rs')).toBeInTheDocument();
    expect(screen.getByText(/@req FR-SCAN-001/)).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'ID' })).toBeInTheDocument();
    expect(screen.getByText('TASK-001')).toBeInTheDocument();
    expect(screen.getByText('Implement YAML parser')).toBeInTheDocument();
  });
});
