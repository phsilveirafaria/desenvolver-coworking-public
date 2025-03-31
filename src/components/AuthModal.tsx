import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Modal, Typography, TextField, Button, Alert } from '@mui/material';
import { Lock } from 'lucide-react';

const tokenSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório')
});

type TokenFormData = z.infer<typeof tokenSchema>;

interface AuthModalProps {
  onAuthenticate: (token: string) => Promise<boolean>;
}

const AuthModal: React.FC<AuthModalProps> = ({ onAuthenticate }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<TokenFormData>({
    resolver: zodResolver(tokenSchema)
  });
  
  const onSubmit = async (data: TokenFormData) => {
    setError(null);
    setIsLoading(true);
    try {
      const success = await onAuthenticate(data.token);
      if (!success) {
        setError('Token inválido');
      }
    } catch (error) {
      setError('Erro ao validar token');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Modal
      open={true}
      disableEscapeKeyDown
      disableAutoFocus
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          mx: 2
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'primary.light',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2
            }}
          >
            <Lock size={28} />
          </Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Acesso Restrito
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Digite o token de acesso para continuar
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('token')}
            fullWidth
            type="password"
            label="Token de Acesso"
            error={!!errors.token}
            helperText={errors.token?.message}
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ py: 1.5 }}
          >
            {isLoading ? 'Validando...' : 'Acessar'}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AuthModal;