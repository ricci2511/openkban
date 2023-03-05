import React, { useState } from 'react';
import { RiAddFill } from 'react-icons/ri';
import CreateColumnForm from './create-column-form';

const CreateColumnButton = () => {
    const [creating, setCreating] = useState(false);

    return (
        <li>
            {!creating && (
                <button
                    className="btn flex w-full gap-3"
                    onClick={() => setCreating(true)}
                >
                    <span>Add column</span>
                    <RiAddFill size={20} />
                </button>
            )}
            {creating && <CreateColumnForm setCreating={setCreating} />}
        </li>
    );
};

export default CreateColumnButton;
