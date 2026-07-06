const WHATSAPP_PHONE = '40721766484';

export function whatsappLink(message: string): string {
  return `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
}
