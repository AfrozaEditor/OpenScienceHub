export type Role = 'ISSUER' | 'VERIFIER'

export type User = {
    id: string
    firstName: string
    lastName: string
    email: string
    role: Role
    institution: string
}
