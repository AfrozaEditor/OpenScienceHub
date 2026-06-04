CREATE TABLE "OpenScienceCredential" (
    "id" SERIAL NOT NULL,
    "credentialId" TEXT NOT NULL,
    "issuerDid" TEXT NOT NULL,
    "credentialDefinitionId" TEXT NOT NULL,
    "workId" TEXT NOT NULL,
    "documentHash" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'done',
    "claimsJson" JSONB NOT NULL,
    "rawJson" JSONB NOT NULL DEFAULT '{}',
    "comment" TEXT NOT NULL DEFAULT '',
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenScienceCredential_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OpenScienceCredential_credentialId_key" ON "OpenScienceCredential"("credentialId");
CREATE INDEX "OpenScienceCredential_workId_idx" ON "OpenScienceCredential"("workId");
CREATE INDEX "OpenScienceCredential_documentHash_idx" ON "OpenScienceCredential"("documentHash");
