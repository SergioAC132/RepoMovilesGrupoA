package com.example.demointent;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button btnOne = findViewById(R.id.btnActivityOne);
        Button btnTwo = findViewById(R.id.btnActivityTwo);
        Button btnThree = findViewById(R.id.btnActivityThree);


        btnOne.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this,
                    ActivityOne.class);

            intent.putExtra("nombre", "Sergio ");
            intent.putExtra("apellido", "Alvarado ");
            intent.putExtra("edad", 21);

            startActivity(intent);
        });

        btnTwo.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this,
                    ActivityTwo.class);

            intent.putExtra("carrera", "Ingenieria en Sistemas");
            intent.putExtra("semestre", 7);

            startActivity(intent);
        });

        btnThree.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this,
                    ActivityThree.class);

            intent.putExtra("promedio", 9.6);
            intent.putExtra("becado", true);

            startActivity(intent);
        });

    }
}
