const BASE_URL = process.env.NEXT_PUBLIC_REST_URL!;

export async function restFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options, // ⬅️ spread FIRST
        credentials: "include", // ⬅️ FORCE include
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Request failed");
    }

    return res.json();
}
