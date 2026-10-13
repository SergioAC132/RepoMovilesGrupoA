package com.example.demointent;

import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class ActivityOne extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_one);


        String nombre = getIntent().getStringExtra("nombre");
        String apellido = getIntent().getStringExtra("apellido");
        int edad = getIntent().getIntExtra("edad", 0);

        TextView txtMessage = findViewById(R.id.txtMessage);

        txtMessage.setText(
                "Nombre: " + nombre +
                        "\nApellido: " + apellido +
                        "\nEdad: " + edad
        );


        Button btnRegresar = findViewById(R.id.btnRegresar);

        btnRegresar.setOnClickListener(v -> finish());
    }
}
