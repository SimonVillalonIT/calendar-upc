'use server';

import { DOMAIN } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: `${formData.get('email')}${DOMAIN}`,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    let errorMessage = 'Ocurrió un error desconocido. Inténtalo de nuevo.';
    const status = error.status;

    if (status && status === 400) {
      if (error.message.includes('Invalid login credentials')) {
        errorMessage =
          'Credenciales de inicio de sesión no válidas. Verifica tu email y contraseña.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage =
          'El email no ha sido confirmado. Revisa tu bandeja de entrada para verificar tu cuenta.';
      } else if (error.message.includes('User is banned')) {
        errorMessage = 'Tu cuenta ha sido bloqueada. Contacta con soporte.';
      } else {
        errorMessage = 'Datos de solicitud incorrectos o incompletos.';
      }
    } else if (status && status === 429) {
      errorMessage =
        'Has realizado demasiados intentos en poco tiempo. Por favor, espera y vuelve a intentarlo.';
    } else if (status && status >= 500) {
      errorMessage =
        'Error en el servidor. Estamos trabajando para solucionarlo.';
    }

    return { error: errorMessage };
  }

  return { success: true };
}
