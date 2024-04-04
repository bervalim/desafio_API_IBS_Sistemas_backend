-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "CivilState" AS ENUM ('Married', 'Single', 'Divorced', 'Widower');

-- CreateTable
CREATE TABLE "people" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(45) NOT NULL,
    "password" VARCHAR(120) NOT NULL,
    "sex" "Sex" NOT NULL,
    "birthDate" VARCHAR(30) NOT NULL,
    "civilState" "CivilState" NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "zipCode" VARCHAR(8) NOT NULL,
    "address" VARCHAR(200) NOT NULL,
    "number" INTEGER NOT NULL,
    "complement" VARCHAR(40) NOT NULL,
    "neighborhood" VARCHAR(20) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "person_id" TEXT NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "people_id_key" ON "people"("id");

-- CreateIndex
CREATE UNIQUE INDEX "people_email_key" ON "people"("email");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_id_key" ON "addresses"("id");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_address_key" ON "addresses"("address");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;
