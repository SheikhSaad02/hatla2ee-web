import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Reusable skeleton div component
const SkeletonBar = ({ className = '', style = {} }) => (
  <div
    className={cn('bg-gray-200 rounded animate-pulse', className)}
    style={style}
  />
);

export default function TableSkeleton({
  rows = 5,
  columns = 4,
  showPagination = true,
  className = '',
}) {
  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }, (_, i) => (
                <TableHead key={i}>
                  <SkeletonBar className="h-4 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: rows }, (_, i) => (
              <TableRow key={i}>
                {Array.from({ length: columns }, (_, j) => (
                  <TableCell key={j}>
                    <SkeletonBar
                      className="h-4"
                      style={{
                        width: `${Math.floor(Math.random() * 40) + 60}%`,
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between px-2">
          <SkeletonBar className="h-4 w-32" />

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              <SkeletonBar className="h-4 w-16" />
            </Button>

            {Array.from({ length: 3 }, (_, i) => (
              <Button
                key={i}
                variant={i === 1 ? 'default' : 'outline'}
                size="sm"
                disabled
              >
                <SkeletonBar className="h-4 w-4" />
              </Button>
            ))}

            <Button variant="outline" size="sm" disabled>
              <SkeletonBar className="h-4 w-16" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
