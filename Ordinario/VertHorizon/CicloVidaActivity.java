package com.example.verthorizon;

import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class CicloVidaActivity extends AppCompatActivity {

    private EditText etDato;
    private TextView tvResultado;
    private Button btnMostrar;

    private static final String TAG = "CICLO_VIDA";
    private static final String KEY_DATO = "dato";
    private static final String KEY_RESULTADO = "resultado";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ciclo_vida);

        etDato = findViewById(R.id.etDato);
        tvResultado = findViewById(R.id.tvResultado);
        btnMostrar = findViewById(R.id.btnMostrar);

        Toast.makeText(this, "onCreate()", Toast.LENGTH_SHORT).show();
        Log.d(TAG, "onCreate() ejecutado");

        // Recuperar los datos guardados
        if (savedInstanceState != null) {
            String dato = savedInstanceState.getString(KEY_DATO, "");
            String resultado = savedInstanceState.getString(KEY_RESULTADO, "");

            etDato.setText(dato);
            tvResultado.setText(resultado);

            Log.d(TAG, "Datos restaurados");
        }

        // Mostrar el dato capturado
        btnMostrar.setOnClickListener(v -> {
            String dato = etDato.getText().toString();
            tvResultado.setText("Dato capturado: " + dato);
        });
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        outState.putString(
                KEY_DATO,
                etDato.getText().toString()
        );

        outState.putString(
                KEY_RESULTADO,
                tvResultado.getText().toString()
        );

        Log.d(TAG, "Datos guardados");
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.d(TAG, "onPause() ejecutado");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "onDestroy() ejecutado");
    }
}