package com.example.demointent;

import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class ActivityTwo extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_two);


        String carrera = getIntent().getStringExtra("carrera");
        int semestre = getIntent().getIntExtra("semestre", 0);

        TextView txtName = findViewById(R.id.txtName);

        txtName.setText(
                "Carrera: " + carrera +
                        "\nSemestre: " + semestre
        );


        Button btnRegresar = findViewById(R.id.btnRegresar);

        btnRegresar.setOnClickListener(v -> finish());
    }
}
