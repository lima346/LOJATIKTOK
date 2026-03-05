
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dolpfojgnfmotyddeees.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvbHBmb2pnbmZtb3R5ZGRlZWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2OTM2MjgsImV4cCI6MjA4NzI2OTYyOH0.80JRtVddezUSuLkbNNpwHOOorNk_7l3cLDOpwPXRQRU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('Testing Supabase connection...');
    try {
        const { data, error } = await supabase.from('products').select('*').limit(1);
        if (error) {
            console.error('Error fetching products:', error.message);
        } else {
            console.log('Connection successful! Data:', data);

            console.log('Inserting test product...');
            const { data: insertData, error: insertError } = await supabase
                .from('products')
                .insert([
                    {
                        name: 'Produto Teste Vercel',
                        description: 'Este é um produto de teste para verificar a conexão.',
                        price: 10.99,
                        stock: 100,
                        images: ['https://picsum.photos/seed/test/400/400']
                    }
                ])
                .select();

            if (insertError) {
                console.error('Error inserting product:', insertError.message);
            } else {
                console.log('Product inserted successfully!', insertData);
            }
        }
    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
}

testConnection();
