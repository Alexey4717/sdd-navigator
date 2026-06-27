// @req SCD-TASK-001
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Requirement, Task } from '@/lib/api/types';
import { TasksPanel } from './TasksPanel';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const requirements: Requirement[] = [
  {
    id: 'FR-SCAN-001',
    type: 'FR',
    title: 'Parse YAML',
    description: 'desc',
    status: 'covered',
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-02-28T14:30:00Z',
  },
];

const tasks: Task[] = [
  {
    id: 'TASK-001',
    requirementId: 'FR-SCAN-001',
    title: 'Implement parser',
    status: 'done',
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-02-20T18:00:00Z',
  },
  {
    id: 'TASK-004',
    requirementId: 'FR-API-002',
    title: 'Write detail tests',
    status: 'open',
    createdAt: '2026-02-20T11:00:00Z',
    updatedAt: '2026-02-20T11:00:00Z',
  },
  {
    id: 'TASK-006',
    requirementId: 'FR-EXPORT-001',
    title: 'CSV export',
    status: 'open',
    createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-02-25T10:00:00Z',
  },
];

describe('TasksPanel', () => {
  it('renders all tasks in the table', () => {
    render(<TasksPanel tasks={tasks} requirements={requirements} />);
    expect(screen.getByRole('heading', { name: /tasks/i })).toHaveTextContent(
      '3',
    );
    const table = screen.getByRole('table', { name: /project tasks/i });
    expect(within(table).getAllByRole('row')).toHaveLength(4);
  });

  it('filters tasks by status when chip is toggled', async () => {
    const user = userEvent.setup();
    render(<TasksPanel tasks={tasks} requirements={requirements} />);

    await user.click(screen.getByRole('button', { name: /^open$/i }));

    const table = screen.getByRole('table', { name: /project tasks/i });
    const dataRows = within(table).getAllByRole('row').slice(1);
    expect(dataRows).toHaveLength(2);
    expect(screen.getByText('TASK-004')).toBeInTheDocument();
    expect(screen.getByText('TASK-006')).toBeInTheDocument();
    expect(screen.queryByText('TASK-001')).not.toBeInTheDocument();
  });

  it('highlights orphan tasks with unknown requirement hint', () => {
    render(<TasksPanel tasks={tasks} requirements={requirements} />);
    const orphanRow = screen.getByText('TASK-006').closest('tr');
    expect(orphanRow).not.toBeNull();
    expect(
      within(orphanRow!).getByText('Unknown requirement'),
    ).toBeInTheDocument();
    expect(within(orphanRow!).getByText('FR-EXPORT-001')).toBeInTheDocument();
  });
});
