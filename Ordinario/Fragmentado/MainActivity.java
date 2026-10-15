package com.example.fragmentado;

import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

public class MainActivity extends AppCompatActivity {

    Button btnInicio, btnPerfil, btnConfiguracion;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Referenciar los botones
        btnInicio = findViewById(R.id.btnInicio);
        btnPerfil = findViewById(R.id.btnPerfil);
        btnConfiguracion = findViewById(R.id.btnConfiguracion);

        // Mostrar el fragmento inicial
        if (savedInstanceState == null) {
            cambiarFragmento(new InicioFragment());
        }

        // Botón Inicio
        btnInicio.setOnClickListener(v -> {
            cambiarFragmento(new InicioFragment());
        });

        // Botón Perfil
        btnPerfil.setOnClickListener(v -> {
            cambiarFragmento(new PerfilFragment());
        });

        // Botón Configuración
        btnConfiguracion.setOnClickListener(v -> {
            cambiarFragmento(new ConfiguracionFragment());
        });
    }

    private void cambiarFragmento(Fragment fragmento) {
        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.contenedor, fragmento)
                .commit();
    }
}