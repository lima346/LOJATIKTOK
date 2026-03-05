
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dolpfojgnfmotyddeees.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvbHBmb2pnbmZtb3R5ZGRlZWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2OTM2MjgsImV4cCI6MjA4NzI2OTYyOH0.80JRtVddezUSuLkbNNpwHOOorNk_7l3cLDOpwPXRQRU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function discoverColumns() {
    const { data, error } = await supabase
        .from('products')
        .insert([{ name: 'Check', price: 0 }])
        .select();

    if (error) {
        console.log('Mensagem:', error.message);
    } else {
        console.log('COLUNAS REAIS NO BANCO:', Object.keys(data[0]));
        // Deletar o teste depois
        await supabase.from('products').delete().eq('name', 'Check');
    }
}

discoverColumns();
