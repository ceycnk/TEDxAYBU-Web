-- ==============================================================================
-- TEDxAYBU - Salondaki Kişileri Sıfırlama ve Toplu Çıkış Yetkisi
-- Bu SQL kodunu Supabase Dashboard -> SQL Editor kısmına yapıştırıp RUN diyebilirsiniz.
-- ==============================================================================

-- 1. tickets tablosuna doğrudan UPDATE izni ver (RLS kısıtlamasını kaldırır)
DROP POLICY IF EXISTS "Bilet güncelleme izni" ON public.tickets;
CREATE POLICY "Bilet güncelleme izni"
ON public.tickets
FOR UPDATE
TO anon, authenticated, service_role
USING (true)
WITH CHECK (true);

-- 2. Salondaki herkesi atomik olarak dışarı çıkaran güvenli RPC fonksiyonu
CREATE OR REPLACE FUNCTION public.admin_reset_inside_count(p_pin VARCHAR DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- RLS'e takılmadan superuser yetkisiyle tüm salonu sıfırlar
AS $$
DECLARE
    v_updated_count INT;
BEGIN
    UPDATE public.tickets
    SET 
        is_inside = false,
        last_status_change = NOW()
    WHERE is_inside = true;

    GET DIAGNOSTICS v_updated_count = ROW_COUNT;

    RETURN jsonb_build_object(
        'success', true,
        'reset_count', v_updated_count,
        'message', 'Salondaki tüm katılımcılar dışarı çıkarıldı.'
    );
END;
$$;
