import { Prisma } from '@prisma/client';
type ContractForPdf = Prisma.ContractGetPayload<{
    include: {
        client: {
            select: {
                companyName: true;
                contactName: true;
                email: true;
                phone: true;
                street: true;
                number: true;
                city: true;
                state: true;
                zipCode: true;
            };
        };
        createdBy: {
            select: {
                name: true;
                email: true;
            };
        };
    };
}>;
export declare class ContractsPdfService {
    generateBuffer(contract: ContractForPdf): Promise<Buffer>;
    buildFilename(contract: ContractForPdf): string;
    private renderContract;
    private drawHeader;
    private drawMetaTable;
    private drawScopeTable;
    private drawTerms;
    private drawSignatures;
    private drawFooter;
    private sectionHeading;
    private partyBlock;
    private signatureBlock;
    private formatAddress;
    private formatCurrency;
    private formatDate;
    private slugify;
}
export {};
