-- Country is optional and user-selected; it is never inferred from network or device data.
ALTER TABLE "User" ADD COLUMN "countryCode" TEXT;
