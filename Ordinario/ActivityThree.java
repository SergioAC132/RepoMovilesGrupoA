package com.example.demointent;

import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class ActivityThree extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_three);


        double promedio = getIntent().getDoubleExtra("promedio", 0.0);
        boolean becado = getIntent().getBooleanExtra("becado", false);

        TextView txtNumber = findViewById(R.id.txtNumber);

        txtNumber.setText(
                "Promedio: " + promedio +
                        "\n¿Tiene beca?: " + (becado ? "Si" : "No")
        );


        Button btnRegresar = findViewById(R.id.btnRegresar);

        btnRegresar.setOnClickListener(v -> finish());
    }
}