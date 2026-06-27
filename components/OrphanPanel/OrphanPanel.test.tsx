// @req SCD-ORPH-001
import { render, screen } from '@testing-library/react';
import type { Annotation, Requirement, Task } from '@/lib/api/types';
import { OrphanPanel } from './OrphanPanel';

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

const annotations: Annotation[] = [
  {
    file: 'src/legacy.rs',
    line: 99,
    reqId: 'FR-LEGACY-001',
    type: 'impl',
    snippet: '@req FR-LEGACY-001',
  },
  {
    file: 'tests/old.rs',
    line: 12,
    reqId: 'FR-API-099',
    type: 'test',
    snippet: '@req FR-API-099',
  },
];

const tasks: Task[] = [
  {
    id: 'TASK-006',
    requirementId: 'FR-EXPORT-001',
    title: 'CSV export',
    status: 'open',
    createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-02-25T10:00:00Z',
  },
];

describe('OrphanPanel', () => {
  it('shows orphan counts and lists orphan annotations and tasks', () => {
    render(
      <OrphanPanel
        annotations={annotations}
        tasks={tasks}
        requirements={requirements}
      />,
    );

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /annotation orphans/i }),
    ).toHaveTextContent('2');
    expect(screen.getByRole('heading', { name: /task orphans/i })).toHaveTextContent(
      '1',
    );
    expect(screen.getByText('FR-LEGACY-001')).toBeInTheDocument();
    expect(screen.getByText('FR-API-099')).toBeInTheDocument();
    expect(screen.getByText('TASK-006')).toBeInTheDocument();
  });

  it('shows empty message when no orphans exist', () => {
    render(
      <OrphanPanel annotations={[]} tasks={[]} requirements={requirements} />,
    );

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(
      screen.getByText('No orphan annotations or tasks detected.'),
    ).toBeInTheDocument();
  });
});
