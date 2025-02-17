'use client'

import React from 'react';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';

const CustomEditor = ({onChange,post}) => {
    const cloud = useCKEditorCloud({
        version: '44.2.0',
        premium: true
    });

    if (cloud.status === 'error') {
        return <div>Error!</div>;
    }

    if (cloud.status === 'loading') {
        return <div>Loading...</div>;
    }

    const {
        ClassicEditor,
        Essentials,
        Paragraph,
        Bold,
        Italic,
        Link,
        Code,
        CodeBlock
    } = cloud.CKEditor;

    const { FormatPainter } = cloud.CKEditorPremiumFeatures;

    return (
        <CKEditor
            editor={ClassicEditor}
            data={post.content}
            config={{
                licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDA4NzM1OTksImp0aSI6ImQ3MDQ2NjhkLTJiZmEtNDUwMS1hZThjLWUyOGU4N2E3M2U4MyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImQ3YWJjM2QwIn0.UhGgzaEYdGIFirW_vp1BDyVdGcAb5IcB2IsEfSjDlLXfa-inOUGJ6SsWiuzY0Pa60o0qlRX3AkmnVQ44jmMMqw',
                plugins: [
                    Essentials,
                    Paragraph,
                    Bold,
                    Italic,
                    FormatPainter,
                    Link,
                    Code,
                    CodeBlock
                ],
                toolbar: [
                    'undo', 'redo',
                    '|',
                    'bold', 'italic',
                    '|',
                    'link',
                    '|',
                    'code', 'codeBlock',
                    '|',
                    'formatPainter'
                ],
                codeBlock: {
                    languages: [
                        { language: 'plaintext', label: 'Plain text' },
                        { language: 'javascript', label: 'JavaScript' },
                        { language: 'python', label: 'Python' },
                        { language: 'css', label: 'CSS' },
                        { language: 'html', label: 'HTML' }
                    ]
                }
             
                
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                // Pass this data to your parent component/form
                onChange(data);
            }}
        />
    );
};

export default CustomEditor;