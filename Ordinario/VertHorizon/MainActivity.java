package com.example.verthorizon;


import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button btnCicloVida = findViewById(R.id.btnCicloVida);

        btnCicloVida.setOnClickListener(v -> {
            Intent intent = new Intent(
                    MainActivity.this,
                    CicloVidaActivity.class
            );

            startActivity(intent);
        });
    }
}