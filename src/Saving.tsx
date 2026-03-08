import { useState, useEffect, useRef, DragEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FileItem {
    name: string;
    size: number;
    uploadedAt: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

const BASE = "https://mypage-backend-7oij.onrender.com/api";

async function fetchFiles(): Promise<FileItem[]> {
    const res = await fetch(`${BASE}/files`);
    if (!res.ok) throw new Error("파일 목록 조회 실패");
    return res.json();
}

async function uploadFiles(files: File[]): Promise<void> {
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    const res = await fetch(`${BASE}/upload`, { method: "POST", body: formData });
    if (!res.ok) throw new Error("업로드 실패");
}

async function deleteFile(filename: string): Promise<void> {
    const res = await fetch(`${BASE}/files/${encodeURIComponent(filename)}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("삭제 실패");
}

function downloadUrl(filename: string): string {
    return `${BASE}/download/${encodeURIComponent(filename)}`;
}

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleString("ko-KR");
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Saving() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    const loadFiles = async () => {
        setLoading(true);
        setError(null);
        try {
            setFiles(await fetchFiles());
        } catch {
            setError("파일 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFiles();
    }, []);

    const handleUpload = async (selected: FileList | null) => {
        if (!selected || selected.length === 0) return;
        setUploading(true);
        setError(null);
        try {
            await uploadFiles(Array.from(selected));
            await loadFiles();
        } catch {
            setError("업로드에 실패했습니다.");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const handleDelete = async (filename: string) => {
        if (!window.confirm(`"${filename}" 을(를) 삭제하시겠습니까?`)) return;
        setError(null);
        try {
            await deleteFile(filename);
            await loadFiles();
        } catch {
            setError("삭제에 실패했습니다.");
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        handleUpload(e.dataTransfer.files);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleUpload(e.target.files);
    };

    return (
        <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px", fontFamily: "sans-serif" }}>
            <button onClick={() => navigate("/")}>
                포트폴리오로 돌아가기
            </button>
            <h1 style={{ marginBottom: 24 }}>파일 관리</h1>

            {/* 업로드 영역 */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={() => setDragging(false)}
                onClick={() => inputRef.current?.click()}
                style={{
                    border: `2px dashed ${dragging ? "#0070f3" : "#aaa"}`,
                    borderRadius: 8,
                    padding: "40px 20px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: dragging ? "#f0f7ff" : "#fafafa",
                    marginBottom: 24,
                    transition: "all 0.15s",
                }}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleInputChange}
                />
                {uploading ? (
                    <p style={{ margin: 0 }}>업로드 중...</p>
                ) : (
                    <>
                        <p style={{ margin: 0, fontSize: 16 }}>파일을 드래그하거나 클릭하여 업로드</p>
                        <p style={{ margin: "8px 0 0", color: "#888", fontSize: 13 }}>여러 파일 동시 업로드 가능</p>
                    </>
                )}
            </div>

            {/* 에러 메시지 */}
            {error && <p style={{ color: "red", marginBottom: 16 }}>{error}</p>}

            {/* 파일 목록 */}
            {loading ? (
                <p>로딩 중...</p>
            ) : files.length === 0 ? (
                <p style={{ color: "#888" }}>업로드된 파일이 없습니다.</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
                            <th style={{ padding: "8px 12px" }}>파일명</th>
                            <th style={{ padding: "8px 12px" }}>크기</th>
                            <th style={{ padding: "8px 12px" }}>업로드 일시</th>
                            <th style={{ padding: "8px 12px" }}>작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((f) => (
                            <tr key={f.name} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "8px 12px" }}>{f.name}</td>
                                <td style={{ padding: "8px 12px" }}>{formatSize(f.size)}</td>
                                <td style={{ padding: "8px 12px" }}>{formatDate(f.uploadedAt)}</td>
                                <td style={{ padding: "8px 12px", whiteSpace: "nowrap" }}>
                                    <a
                                        href={downloadUrl(f.name)}
                                        download={f.name}
                                        style={{ marginRight: 12, color: "#0070f3" }}
                                    >
                                        다운로드
                                    </a>
                                    <button
                                        onClick={() => handleDelete(f.name)}
                                        style={{ color: "red", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}