import { put } from '@vercel/blob';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response('No file uploaded', { status: 400 });
    }

    const { url } = await put(file.name, file, { access: 'public' });
    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return new Response(JSON.stringify({ error: 'Error uploading file' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
