import { Injectable } from '@nestjs/common';
import {
  ContractStatus,
  PaymentFrequency,
  Prisma,
} from '@prisma/client';
import PDFDocument from 'pdfkit';

const PRIMARY = '#004949';
const ACCENT = '#E8C39E';
const MUTED = '#64748B';

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
    createdBy: { select: { name: true; email: true } };
  };
}>;

const STATUS_LABELS: Record<ContractStatus, string> = {
  DRAFT: 'Rascunho',
  SENT: 'Enviado',
  SIGNED: 'Assinado',
  EXPIRED: 'Expirado',
  CANCELLED: 'Cancelado',
};

const FREQUENCY_LABELS: Record<PaymentFrequency, string> = {
  MONTHLY: 'Mensal',
  ONE_TIME: 'Único',
};

@Injectable()
export class ContractsPdfService {
  async generateBuffer(contract: ContractForPdf): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 48, bottom: 56, left: 48, right: 48 },
        info: {
          Title: contract.title,
          Author: 'ATRIA ERP',
          Subject: `Contrato - ${contract.client.companyName}`,
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      this.renderContract(doc, contract);
      doc.end();
    });
  }

  buildFilename(contract: ContractForPdf): string {
    const client = this.slugify(contract.client.companyName);
    const date = contract.startDate.toISOString().slice(0, 10);
    return `Contrato-${client}-${date}.pdf`;
  }

  private renderContract(doc: PDFKit.PDFDocument, contract: ContractForPdf) {
    const pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    this.drawHeader(doc, contract, pageWidth);
    this.drawMetaTable(doc, contract, pageWidth);
    this.drawScopeTable(doc, contract, pageWidth);
    this.drawTerms(doc, contract, pageWidth);
    this.drawSignatures(doc, contract, pageWidth);
    this.drawFooter(doc, contract);
  }

  private drawHeader(
    doc: PDFKit.PDFDocument,
    contract: ContractForPdf,
    pageWidth: number,
  ) {
    doc
      .fillColor(PRIMARY)
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('ATRIA ERP', { continued: false });

    doc
      .fillColor(MUTED)
      .font('Helvetica')
      .fontSize(9)
      .text('Gestão inteligente para agências e estúdios', {
        lineGap: 4,
      });

    doc.moveDown(1.2);

    doc
      .fillColor(PRIMARY)
      .font('Helvetica-Bold')
      .fontSize(20)
      .text(contract.title, { width: pageWidth });

    doc.moveDown(0.4);

    doc
      .fillColor(MUTED)
      .font('Helvetica')
      .fontSize(10)
      .text(
        `Contrato de Prestação de Serviços · ${STATUS_LABELS[contract.status]}`,
      );

    doc.moveDown(1);

    const lineY = doc.y;
    doc
      .strokeColor(ACCENT)
      .lineWidth(2)
      .moveTo(doc.page.margins.left, lineY)
      .lineTo(doc.page.margins.left + pageWidth, lineY)
      .stroke();

    doc.moveDown(1.2);
  }

  private drawMetaTable(
    doc: PDFKit.PDFDocument,
    contract: ContractForPdf,
    pageWidth: number,
  ) {
    this.sectionHeading(doc, 'Dados das Partes');

    const colWidth = pageWidth / 2 - 8;
    const startY = doc.y;

    this.partyBlock(doc, 'CONTRATANTE (CLIENTE)', [
      contract.client.companyName,
      contract.client.contactName
        ? `Contato: ${contract.client.contactName}`
        : null,
      contract.client.email ? `E-mail: ${contract.client.email}` : null,
      contract.client.phone ? `Telefone: ${contract.client.phone}` : null,
      this.formatAddress(contract.client),
    ], doc.page.margins.left, startY, colWidth);

    this.partyBlock(
      doc,
      'CONTRATADA (AGÊNCIA)',
      [
        'ATRIA ERP',
        `Responsável: ${contract.createdBy.name}`,
        contract.createdBy.email
          ? `E-mail: ${contract.createdBy.email}`
          : null,
      ],
      doc.page.margins.left + colWidth + 16,
      startY,
      colWidth,
    );

    doc.y = startY + 108;
    doc.moveDown(0.8);
  }

  private drawScopeTable(
    doc: PDFKit.PDFDocument,
    contract: ContractForPdf,
    pageWidth: number,
  ) {
    this.sectionHeading(doc, 'Escopo e Valores');

    const rows = [
      ['Valor', this.formatCurrency(Number(contract.recurringValue))],
      ['Frequência', FREQUENCY_LABELS[contract.paymentFrequency]],
      ['Início da vigência', this.formatDate(contract.startDate)],
      [
        'Término',
        contract.endDate ? this.formatDate(contract.endDate) : 'Indeterminado',
      ],
      ['Status', STATUS_LABELS[contract.status]],
    ];

    const tableTop = doc.y;
    const labelWidth = pageWidth * 0.34;
    const valueWidth = pageWidth - labelWidth;
    const rowHeight = 26;

    rows.forEach(([label, value], index) => {
      const y = tableTop + index * rowHeight;
      const fill = index % 2 === 0 ? '#F8FAFA' : '#FFFFFF';

      doc.rect(doc.page.margins.left, y, pageWidth, rowHeight).fill(fill);

      doc
        .fillColor(PRIMARY)
        .font('Helvetica-Bold')
        .fontSize(9)
        .text(label, doc.page.margins.left + 10, y + 8, {
          width: labelWidth - 16,
        });

      doc
        .fillColor('#1E293B')
        .font('Helvetica')
        .fontSize(9)
        .text(value, doc.page.margins.left + labelWidth, y + 8, {
          width: valueWidth - 10,
        });
    });

    doc
      .strokeColor('#E2E8F0')
      .lineWidth(1)
      .rect(doc.page.margins.left, tableTop, pageWidth, rows.length * rowHeight)
      .stroke();

    doc.y = tableTop + rows.length * rowHeight + 16;
  }

  private drawTerms(
    doc: PDFKit.PDFDocument,
    contract: ContractForPdf,
    pageWidth: number,
  ) {
    this.sectionHeading(doc, 'Cláusulas e Termos');

    doc
      .fillColor('#334155')
      .font('Helvetica')
      .fontSize(10)
      .text(contract.termsContent, {
        width: pageWidth,
        align: 'justify',
        lineGap: 4,
      });

    doc.moveDown(1.5);
  }

  private drawSignatures(
    doc: PDFKit.PDFDocument,
    contract: ContractForPdf,
    pageWidth: number,
  ) {
    const remaining = doc.page.height - doc.page.margins.bottom - doc.y;
    if (remaining < 140) {
      doc.addPage();
    }

    this.sectionHeading(doc, 'Assinaturas');

    const colWidth = pageWidth / 2 - 12;
    const baseY = doc.y + 24;
    const leftX = doc.page.margins.left;
    const rightX = doc.page.margins.left + colWidth + 24;

    this.signatureBlock(
      doc,
      leftX,
      baseY,
      colWidth,
      contract.client.companyName,
      contract.client.contactName ?? 'Representante legal',
    );

    this.signatureBlock(
      doc,
      rightX,
      baseY,
      colWidth,
      'ATRIA ERP',
      contract.createdBy.name,
    );

    if (contract.status === ContractStatus.SIGNED) {
      doc
        .fillColor(MUTED)
        .font('Helvetica-Oblique')
        .fontSize(8)
        .text(
          `Documento assinado digitalmente em ${this.formatDate(contract.updatedAt)}.`,
          leftX,
          baseY + 92,
          { width: pageWidth, align: 'center' },
        );
    }

    doc.y = baseY + 110;
  }

  private drawFooter(doc: PDFKit.PDFDocument, contract: ContractForPdf) {
    const footerY = doc.page.height - doc.page.margins.bottom + 12;
    const pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    doc
      .fillColor(MUTED)
      .font('Helvetica')
      .fontSize(8)
      .text(
        `Gerado em ${this.formatDate(new Date())} · ID ${contract.id.slice(0, 8).toUpperCase()}`,
        doc.page.margins.left,
        footerY,
        { width: pageWidth, align: 'center' },
      );
  }

  private sectionHeading(doc: PDFKit.PDFDocument, title: string) {
    doc
      .fillColor(PRIMARY)
      .font('Helvetica-Bold')
      .fontSize(11)
      .text(title.toUpperCase());
    doc.moveDown(0.5);
  }

  private partyBlock(
    doc: PDFKit.PDFDocument,
    title: string,
    lines: (string | null)[],
    x: number,
    y: number,
    width: number,
  ) {
    doc
      .roundedRect(x, y, width, 96, 6)
      .fillAndStroke('#F8FAFA', '#E2E8F0');

    doc
      .fillColor(PRIMARY)
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(title, x + 10, y + 10, { width: width - 20 });

    let cursorY = y + 26;
    lines
      .filter((line): line is string => Boolean(line))
      .forEach((line) => {
        doc
          .fillColor('#334155')
          .font('Helvetica')
          .fontSize(9)
          .text(line, x + 10, cursorY, { width: width - 20 });
        cursorY += 14;
      });
  }

  private signatureBlock(
    doc: PDFKit.PDFDocument,
    x: number,
    y: number,
    width: number,
    party: string,
    representative: string,
  ) {
    doc
      .strokeColor('#CBD5E1')
      .lineWidth(1)
      .moveTo(x, y + 48)
      .lineTo(x + width, y + 48)
      .stroke();

    doc
      .fillColor(PRIMARY)
      .font('Helvetica-Bold')
      .fontSize(9)
      .text(party, x, y + 56, { width, align: 'center' });

    doc
      .fillColor(MUTED)
      .font('Helvetica')
      .fontSize(8)
      .text(representative, x, y + 70, { width, align: 'center' });
  }

  private formatAddress(
    client: ContractForPdf['client'],
  ): string | null {
    const parts = [
      client.street && client.number
        ? `${client.street}, ${client.number}`
        : client.street,
      client.city && client.state
        ? `${client.city} - ${client.state}`
        : client.city ?? client.state,
      client.zipCode ? `CEP ${client.zipCode}` : null,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(' · ') : null;
  }

  private formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  private formatDate(value: Date) {
    return value.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  private slugify(value: string) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
  }
}
