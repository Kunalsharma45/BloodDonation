import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateInvoice = (donation, user) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Header Color
    doc.setFillColor(220, 38, 38); // Red 600
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Logo / Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('LiForce', 20, 25);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Blood Donation', 20, 32);

    // Invoice Label
    doc.setFontSize(30);
    doc.text('CERTIFICATE', pageWidth - 20, 25, { align: 'right' });
    doc.setFontSize(10);
    doc.text('OF DONATION', pageWidth - 20, 32, { align: 'right' });

    // Details Section
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(12);
    const startY = 60;

    // Donor Info
    doc.setFont('helvetica', 'bold');
    doc.text('Donor Details:', 20, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${user?.Name || 'N/A'}`, 20, startY + 8);
    doc.text(`Email: ${user?.Email || 'N/A'}`, 20, startY + 16);
    doc.text(`Blood Group: ${user?.bloodGroup || 'N/A'}`, 20, startY + 24);

    // Donation Info
    doc.setFont('helvetica', 'bold');
    doc.text('Donation Details:', pageWidth / 2 + 10, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date & Time: ${new Date(donation.dateTime).toLocaleString()}`, pageWidth / 2 + 10, startY + 8);
    doc.text(`Reference ID: ${donation._id}`, pageWidth / 2 + 10, startY + 16);
    doc.text(`Organization: ${donation.organizationId?.Name || 'Unknown'}`, pageWidth / 2 + 10, startY + 24);

    // Table
    const tableColumn = ["Description", "Quantity", "Status"];
    const tableRows = [
        [
            "Whole Blood Donation",
            `${donation.unitsCollected || 1} Unit(s)`,
            donation.status
        ]
    ];

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: startY + 40,
        theme: 'grid',
        headStyles: { fillColor: [220, 38, 38] },
        styles: { fontSize: 12, cellPadding: 3 },
    });

    // Thank you note
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('"The blood you donate gives someone another chance at life."', pageWidth / 2, finalY, { align: 'center' });
    doc.text('Thank you for your heroism.', pageWidth / 2, finalY + 8, { align: 'center' });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a system generated certificate.', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save
    doc.save(`Donation_Certificate_${donation._id.slice(-6)}.pdf`);
};
