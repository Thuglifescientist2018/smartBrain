import React from 'react';
import './ImageLinkForm.css';



function ImageLinkForm({onInputChange, onButtonSubmit}) {
    return (  
        <div>
           <p className="f3">
               {'This Magic brain will detect faces in your pictures. Give it a try'}
           </p>
        <div className='center'>
            <div className='form center pa4 br3 shadow-5'>
            <input className='f4 w-70 center pa2' style={{outline: 'none'}} type="text"  onChange={onInputChange}/>
            <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick={onButtonSubmit}>Detect</button>

            </div>
        </div>

        </div>
    );
}

export default ImageLinkForm;