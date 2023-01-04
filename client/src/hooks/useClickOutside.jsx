import { useEffect } from 'react';

function useClickOutside(callback, outsideNodes = [], excludeNodes = []) {
    useEffect(() => {
        const handleClickOutside = (event) => {
            for (const node of excludeNodes) {
                if (node && node.contains(event.target)) {
                    return
                }
            }
            
            for (const node of outsideNodes) {
                if (node && !node.contains(event.target)) {
                    callback()
                    return;
                }
            }
        }

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    })

}

export default useClickOutside;