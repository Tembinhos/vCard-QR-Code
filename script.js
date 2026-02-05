const form = document.getElementById('contactForm');
const result = document.getElementById('result');
const qrOutput = document.getElementById('qrOutput');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');

let currentSvg = '';

const escapeVCardValue = (value) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');

function buildVCard({ name, phone, organization, title }) {
  const safeName = escapeVCardValue(name.trim());
  const safePhone = escapeVCardValue(phone.trim());
  const safeOrg = escapeVCardValue(organization.trim());
  const safeTitle = escapeVCardValue(title.trim());

  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${safeName};;;;`,
    `FN:${safeName}`,
    `TEL;TYPE=CELL:${safePhone}`,
    safeOrg ? `ORG:${safeOrg}` : '',
    safeTitle ? `TITLE:${safeTitle}` : '',
    'END:VCARD',
  ]
    .filter(Boolean)
    .join('\n');
}

function generateSvg(vCardString) {
  const qr = qrcode(0, 'M');
  qr.addData(vCardString);
  qr.make();
  return qr.createSvgTag({
    cellSize: 4,
    margin: 4,
    scalable: true,
  });
}

function downloadSvg() {
  if (!currentSvg) return;
  const blob = new Blob([currentSvg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'contact-qr.svg';
  link.click();
  URL.revokeObjectURL(url);
}

async function shareSvg() {
  if (!currentSvg) return;
  const file = new File([currentSvg], 'contact-qr.svg', { type: 'image/svg+xml' });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: 'My Contact QR Code',
      text: 'Scan this QR code to save my contact.',
      files: [file],
    });
    return;
  }

  downloadSvg();
  alert('Direct share is not available here, so the SVG was downloaded instead.');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    organization: document.getElementById('organization').value,
    title: document.getElementById('title').value,
  };

  const vCardString = buildVCard(data);
  currentSvg = generateSvg(vCardString);

  qrOutput.innerHTML = currentSvg;
  result.hidden = false;
});

downloadBtn.addEventListener('click', downloadSvg);
shareBtn.addEventListener('click', () => {
  shareSvg().catch((error) => {
    console.error('Share failed:', error);
    alert('Could not share. You can still use Download SVG.');
  });
});
