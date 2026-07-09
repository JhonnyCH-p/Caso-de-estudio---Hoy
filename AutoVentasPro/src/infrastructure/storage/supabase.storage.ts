import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env['SUPABASE_URL'] || '';
const supabaseKey = process.env['SUPABASE_ANON_KEY'] || '';
const bucketName = process.env['SUPABASE_BUCKET'] || 'vehiculos';

const supabase = createClient(supabaseUrl, supabaseKey);

let bucketInitialized = false;

async function ensureBucket(): Promise<void> {
   if (bucketInitialized) return;
   try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const exists = buckets?.some(b => b.name === bucketName);
      if (!exists) {
         const { error } = await supabase.storage.createBucket(bucketName, { public: true });
         if (error) {
            console.warn(`No se pudo crear bucket "${bucketName}": ${error.message}. Asegúrate de crearlo en Supabase Dashboard.`);
         }
      }
      bucketInitialized = true;
   } catch {
      bucketInitialized = true;
   }
}

export async function uploadFile(
   buffer: Buffer,
   fileName: string,
   mimeType: string,
): Promise<string> {
   await ensureBucket();
   const filePath = `${Date.now()}-${fileName}`;
   const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, { contentType: mimeType, upsert: true });
   if (error) throw new Error(`Error al subir archivo: ${error.message}`);
   const { data: publicUrl } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
   return publicUrl.publicUrl;
}

export async function deleteFile(fileUrl: string): Promise<void> {
   const path = fileUrl.split('/').pop();
   if (!path) return;
   const { error } = await supabase.storage.from(bucketName).remove([path]);
   if (error) throw new Error(`Error al eliminar archivo: ${error.message}`);
}
