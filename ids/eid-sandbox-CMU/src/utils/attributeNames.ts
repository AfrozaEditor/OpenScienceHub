export const ISSUER_ATTRIBUTE_NAMES: readonly string[] = [
	// Primary issuer identifiers
	'issuer',
	'issuer_name',
	'issuerName',
	'issuing_authority',
	'licensing_authority',

	// Organizational identifiers
	'organization',
	'organization_name',
	'org_name',

	// Authority identifiers
	'authority',
	'authority_name',
	'certifying_authority',

	// Government/Institutional identifiers
	'government_authority',
	'institution',
	'institution_name',

	// Alternative naming conventions
	'issuer_organization',
	'certificate_issuer',
	'credential_issuer',

	// Student
	'student_id',
	'student_name',
	'course_name',
	'course_code',
	'course_description',
	'course_instructor',
	'course_instructor_name',
	'course_instructor_email',
	'course_instructor_phone',
	'course_instructor_address',
	'course_instructor_city',

	// User profile attributes
	'username',
	'profile_bio',
	'profile_image_hash',
	'age',
	'account_created_ymd',
] as const;

/**
 * Required schema attributes that must always be included in credential offers
 * These are the minimum attributes required by the credential schema
 */
export const REQUIRED_SCHEMA_ATTRIBUTES: readonly string[] = [
	'student_id',
	'student_name',
	'age',
	'course_name',
] as const;

