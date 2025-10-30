"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { authCookies } from "@/utils/cookies";

interface ProfilePictureModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPictureUrl: string | null;
    onUpdate: () => void;
}

const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({
    isOpen,
    onClose,
    currentPictureUrl,
    onUpdate
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentPictureUrl);
    const [updating, setUpdating] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper function to convert file to base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove the data:image/jpeg;base64, prefix
                const base64 = (reader.result as string).split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleFileSelect = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            toast.error("Please select a valid image file");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleUpdate = async () => {
        if (!selectedFile) {
            toast.error("Please select an image file");
            return;
        }

        // Check file size (max 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        setUpdating(true);
        try {
            // Step 1: Convert file to base64
            const base64String = await fileToBase64(selectedFile);
            const filename = `profile_${Date.now()}_${selectedFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

            // Step 2: Upload to S3
            const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/uploadtoaws`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authCookies.getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filename: filename,
                    base64String: base64String
                })
            });

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                throw new Error(errorData.message || 'Failed to upload image');
            }

            const uploadData = await uploadResponse.json();
            const imageUrl = uploadData.fileUrl;

            if (!imageUrl) {
                throw new Error('No image URL returned from upload');
            }

            console.log('Uploaded image URL:', imageUrl);

            // Step 3: Update profile with the image URL
            const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authCookies.getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    profile_picture: imageUrl
                })
            });

            if (!updateResponse.ok) {
                const errorData = await updateResponse.json();
                throw new Error(errorData.message || 'Failed to update profile picture');
            }

            const updateData = await updateResponse.json();
            console.log('Profile update response:', updateData);

            // Update the preview to show the new image URL
            setPreviewUrl(imageUrl);

            toast.success("Profile picture updated successfully!", { position: "top-right" });
            onUpdate(); // Refresh user data
            onClose();
        } catch (error: any) {
            console.error('Profile picture update error:', error);
            toast.error(error.message || "Failed to update profile picture", { position: "top-right" });
        } finally {
            setUpdating(false);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setPreviewUrl(currentPictureUrl);
        setDragOver(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content bg-white card-box border-20 mt-30 shadow-lg">
                    <div className="modal-header border-0 pb-0">
                        <div className="d-flex align-items-center">
                            <div className="me-3">
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#D3FA38',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="bi bi-camera" style={{ color: '#244034', fontSize: '20px' }}></i>
                                </div>
                            </div>
                            <div>
                                <h5 className="modal-title dash-title-three mb-1">Update Profile Picture</h5>
                                <p className="text-muted mb-0 small">Upload a new photo to personalize your profile</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                            disabled={updating}
                        ></button>
                    </div>
                    <div className="modal-body px-4 py-4">
                        <div className="row g-4">
                            {/* Upload Section */}
                            <div className="col-md-7">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold" style={{ color: '#244034' }}>
                                        Upload New Picture
                                    </label>
                                </div>
                                <div
                                    className={`border-3 border-dashed rounded-4 p-4 text-center cursor-pointer transition-all position-relative ${
                                        dragOver ? 'border-success bg-success bg-opacity-10 shadow-lg' : 'border-secondary'
                                    }`}
                                    style={{
                                        backgroundColor: dragOver ? 'rgba(25, 135, 84, 0.08)' : '#f8f9fa',
                                        borderColor: dragOver ? '#198754' : '#dee2e6',
                                        minHeight: '220px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: dragOver ? '0 8px 25px rgba(25, 135, 84, 0.2)' : '0 4px 15px rgba(0,0,0,0.05)'
                                    }}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="mb-3">
                                        <i className={`bi ${dragOver ? 'bi-cloud-check' : 'bi-cloud-upload'}`}
                                           style={{
                                               fontSize: '3rem',
                                               color: dragOver ? '#198754' : '#6c757d'
                                           }}></i>
                                    </div>
                                    <h6 className="mb-2 fw-bold" style={{ color: '#244034' }}>
                                        {selectedFile ? (
                                            <span style={{ color: '#198754' }}>{selectedFile.name}</span>
                                        ) : (
                                            'Click to upload or drag and drop'
                                        )}
                                    </h6>
                                    <p className="text-muted mb-0 fw-medium" style={{ fontSize: '14px', color: '#6c757d' }}>
                                        PNG, JPG, GIF up to 5MB
                                    </p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="d-none"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={updating}
                                    />
                                </div>
                            </div>

                            {/* Preview Section */}
                            <div className="col-md-5">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold" style={{ color: '#244034' }}>
                                        Preview
                                    </label>
                                </div>
                                <div className="d-flex flex-column align-items-center">
                                    <div className="rounded-circle overflow-hidden border shadow-lg position-relative mb-3"
                                         style={{
                                             width: '120px',
                                             height: '120px',
                                             backgroundColor: '#ffffff',
                                             border: '4px solid #D3FA38',
                                             boxShadow: '0 8px 30px rgba(210, 243, 76, 0.3)'
                                         }}>
                                        {previewUrl ? (
                                            <Image
                                                src={previewUrl}
                                                alt="Profile Preview"
                                                width={120}
                                                height={120}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-center h-100">
                                                <i className="bi bi-person-circle text-muted" style={{ fontSize: '3rem' }}></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-muted mb-2 fw-medium" style={{ color: '#495057', fontSize: '14px' }}>
                                            {previewUrl ? 'New Profile Picture' : 'No image selected'}
                                        </p>
                                        {previewUrl && (
                                            <small className="text-success fw-semibold">
                                                <i className="bi bi-check-circle me-1"></i>
                                                Ready to upload
                                            </small>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer border-0 pt-0 px-4 pb-4">
                        <button
                            type="button"
                            className="btn btn-outline-secondary px-4 py-2"
                            onClick={handleClose}
                            disabled={updating}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="dash-btn-two px-4 py-2"
                            onClick={handleUpdate}
                            disabled={updating || !selectedFile}
                            style={{ minWidth: '140px' }}
                        >
                            {updating ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-upload me-2"></i>
                                    Update Picture
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePictureModal;