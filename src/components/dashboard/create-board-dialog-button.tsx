import { Button } from '@components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@components/ui/dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { CreateBoardContent } from './board-creation/create-board-content';

export const CreateBoardDialogButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen} modal>
            <DialogTrigger asChild>
                <Button variant="primary">
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Create board</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <CreateBoardContent close={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
};
