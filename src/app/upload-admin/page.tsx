// pages/upload.tsx
'use client';
import { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


export default function UploadPage() {
    const [status, setStatus] = useState('');
    const [isVerified, setIsVefied] = useState(false)

    

    function Verify() {
        return (
            <Input placeholder='enter you hash key' onChange={(e) => {
                if (e.target.value === process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)
                    setIsVefied(true)
            }} />

        )
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            const colRef = collection(db, 'movies'); // Replace with your collection name

            for (const item of data) {
                await addDoc(colRef, item);
            }

            setStatus('✅ Upload successful!');
        } catch (err: any) {
            console.error(err);
            setStatus(`❌ Upload failed: ${err.message}`);
        }
    };

    // if (!isVerified) return <Verify />
    
    return (
        <main className="p-8">
            <h1 className="text-xl mb-4">Upload JSON to Firestore</h1>
            <input type="file" accept=".json" onChange={handleFileChange} />
            <p className="mt-4">{status}</p>
        </main>
    );
}
