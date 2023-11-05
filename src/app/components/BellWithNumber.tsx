import React from 'react';
import { FiBell } from 'react-icons/fi';

interface BellWithNumberProps {
    count: number;
    onClick: () => void;
}

const BellWithNumber = ({ count, onClick }: BellWithNumberProps) => {
    return (
        <div style={{ position: 'relative' }} onClick={onClick}>
            <FiBell size={24} className="text-2xl text-gray-500 hover:text-gray-900 cursor-pointer" />
            {count > 0 && (
                <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    fontSize: '10px',
                    background: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    width: '15px',
                    height: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {count}
                </span>
            )}
        </div>
    );
};

export default BellWithNumber;