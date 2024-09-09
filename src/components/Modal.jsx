import { useEffect, useRef } from 'react'

export default function Modal({openModal, closeModal, children}){
    const ref = useRef();

    useEffect(() => {
        if (openModal) {
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [openModal]);

    return (
        <dialog ref={ref} onCancel={closeModal} className="modal-container">
            {children}
            {/* <button onClick={closeModal}>Close</button> */}
        </dialog>
    );
}