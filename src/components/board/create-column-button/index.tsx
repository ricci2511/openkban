import React, { useState } from 'react';
import { RiAddFill } from 'react-icons/ri';
import CreateColumnForm from './create-column-form';

const CreateColumnButton = () => {
    const [creating, setCreating] = useState(false);

    return (
        <div className="min-w-max last:pr-4 last:sm:pr-6 last:lg:pr-8">
            {!creating && (
                <button
                    className="btn flex items-center gap-3"
                    onClick={() => setCreating(true)}
                >
                    Add column
                    <RiAddFill size={20} />
                </button>
            )}
            {creating && <CreateColumnForm setCreating={setCreating} />}
        </div>
    );
};

export default CreateColumnButton;
