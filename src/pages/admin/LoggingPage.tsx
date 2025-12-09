import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/auth-context";
import { fetchAnalyticsEvents } from "@/api/fnb-api";
import { useQuery } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { Button } from "@/components/ui/button.tsx";
import { MoreVertical, FileText } from "lucide-react";
import { useState } from "react";
import CustomPagination from "@/components/app/CustomPagination";
import type { Event } from "@/api/types";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function LoggingPage() {
    const auth = useAuth();

    const [pageNumber, setPageNumber] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const eventsQuery = useQuery({
        queryKey: ["analytics-events", pageNumber],
        queryFn: () =>
            fetchAnalyticsEvents(auth.token ?? "", {
                pageNumber,
                pageSize: 20,
            }),
        enabled: !!auth.token,
    });

    return (
        <div className={"flex flex-col gap-4"}>
            <div className={"flex justify-between items-center"}>
                <div className={"text-xl font-[600]"}>Logging</div>
            </div>
            <div className="rounded-lg border border-border bg-card">
                {eventsQuery.isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <Spinner className={"text-primary size-8"} />
                    </div>
                ) : eventsQuery.error ? (
                    <div className="flex justify-center items-center py-16 text-destructive">
                        Error loading events
                    </div>
                ) : eventsQuery.data?.content.length === 0 ? (
                    <div className="flex flex-col justify-center items-center py-16 gap-4">
                        <FileText className="text-muted-foreground size-12" />
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-lg font-[600]">
                                No events yet
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Events will appear here once actions are
                                performed
                            </div>
                        </div>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className={"bg-muted"}>
                            <TableRow>
                                <TableHead
                                    className={
                                        "text-muted-foreground text-center"
                                    }
                                >
                                    No.
                                </TableHead>
                                <TableHead className={"text-muted-foreground"}>
                                    Title
                                </TableHead>
                                <TableHead className={"text-muted-foreground"}>
                                    Description
                                </TableHead>
                                <TableHead className={"text-muted-foreground"}>
                                    Actor ID
                                </TableHead>
                                <TableHead className={"text-muted-foreground"}>
                                    Occurred At
                                </TableHead>
                                <TableHead className={"text-muted-foreground"}>
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {eventsQuery.data?.content.map(
                                (event: Event, index: number) => {
                                    return (
                                        <TableRow key={event.id}>
                                            <TableCell
                                                className={"text-center"}
                                            >
                                                {pageNumber * 20 + index + 1}
                                            </TableCell>
                                            <TableCell className={"font-[600]"}>
                                                {event.title}
                                            </TableCell>
                                            <TableCell className={"max-w-md"}>
                                                <div className="whitespace-normal break-words">
                                                    {event.description}
                                                </div>
                                            </TableCell>
                                            <TableCell className={"font-[600]"}>
                                                {event.actorId}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    event.occurredAt
                                                ).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() =>
                                                                setSelectedEvent(
                                                                    event
                                                                )
                                                            }
                                                        >
                                                            View Details
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
            <div className="w-full flex justify-end">
                <CustomPagination
                    totalPages={eventsQuery.data?.totalPages ?? 0}
                    currentPage={eventsQuery.data?.number ?? 0}
                    onPageChange={setPageNumber}
                    isLoading={eventsQuery.isLoading}
                    error={eventsQuery.error}
                />
            </div>

            <EventDetailsDialog
                event={selectedEvent}
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />
        </div>
    );
}

function EventDetailsDialog({
    event,
    isOpen,
    onClose,
}: {
    event: Event | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!event) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Event Details</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-sm font-medium">Title</div>
                        <div className="text-sm text-muted-foreground">
                            {event.title}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="text-sm font-medium">Description</div>
                        <div className="text-sm text-muted-foreground">
                            {event.description}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="text-sm font-medium">Actor ID</div>
                        <div className="text-sm text-muted-foreground">
                            {event.actorId}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="text-sm font-medium">Occurred At</div>
                        <div className="text-sm text-muted-foreground">
                            {new Date(event.occurredAt).toLocaleString()}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="text-sm font-medium">Metadata</div>
                        <div className="rounded-md border border-border bg-muted/50 p-4">
                            <pre className="text-xs overflow-auto whitespace-pre-wrap break-words">
                                {JSON.stringify(event.metadata, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
