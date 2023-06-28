import React, { useEffect } from 'react';

const MessageModal = ({ closeModal }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      closeModal();
    }, 7000);

    return () => {
      clearTimeout(timer);
    };
  }, [closeModal]);

  return (
    <div className="modal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Campo Vazio</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>O campo de mensagem está vazio. Preencha-o antes de enviar.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
