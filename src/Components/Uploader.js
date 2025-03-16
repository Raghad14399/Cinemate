import React from 'react'
import { useDropzone } from'react-dropzone'
import { FiUploadCloud } from 'react-icons/fi';
function Uploader() {
  const{getRootProps,getInputProps } = useDropzone({
    Multiple: false,
    maxSize:100000,
    onDrop:(acceptedFiles) =>{
        alert(acceptedFiles[0].name); 
    },
  });
    return  (
        <div className='w-full text-center'>
            <div 
            {...getRootProps()}
            className='py-8 px-6 pt-5 border-2 border-border border-dashed bg-main rounded-2xl cursor-pointer '
            >
            <input {...getInputProps()} />
            <span className='mx-auto flex-colo text-beige3 text-3xl'>
            <FiUploadCloud/>
            </span>
            <p className='text-sm  mt-2 '> Drag your image here </p>
            <em className='text-xs text-border'>
                (only .jpg and .png files will be accepted)
            </em>

            </div>
        </div>
    )
  
}

export default Uploader
