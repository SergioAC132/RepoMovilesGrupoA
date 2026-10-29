package com.example.sensoresynavdrawer;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.util.Locale;

public class GyroscopeActivity extends AppCompatActivity
        implements SensorEventListener {

    private SensorManager sensorManager;
    private Sensor giroscopio;

    private TextView txtX, txtY, txtZ, txtStatus;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_gyroscope);

        txtX = findViewById(R.id.txtGyroX);
        txtY = findViewById(R.id.txtGyroY);
        txtZ = findViewById(R.id.txtGyroZ);
        txtStatus = findViewById(R.id.txtGyroStatus);

        Button btnVolver = findViewById(R.id.btnVolver);
        btnVolver.setOnClickListener(v -> finish());

        sensorManager = (SensorManager)
                getSystemService(Context.SENSOR_SERVICE);

        giroscopio = sensorManager.getDefaultSensor(
                Sensor.TYPE_GYROSCOPE
        );

        if (giroscopio == null) {
            txtStatus.setText(
                    "Este dispositivo no tiene giroscopio disponible."
            );
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (giroscopio != null) {
            boolean registrado = sensorManager.registerListener(
                    this,
                    giroscopio,
                    SensorManager.SENSOR_DELAY_UI
            );

            if (!registrado) {
                txtStatus.setText(
                        "No se pudo registrar el giroscopio."
                );
            }
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        sensorManager.unregisterListener(this);
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() != Sensor.TYPE_GYROSCOPE) {
            return;
        }

        float x = event.values[0];
        float y = event.values[1];
        float z = event.values[2];

        txtX.setText(String.format(
                Locale.getDefault(),
                "Eje X: %.3f rad/s", x
        ));

        txtY.setText(String.format(
                Locale.getDefault(),
                "Eje Y: %.3f rad/s", y
        ));

        txtZ.setText(String.format(
                Locale.getDefault(),
                "Eje Z: %.3f rad/s", z
        ));

        txtStatus.setText("Estado: sensor activo");
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // No necesitamos realizar ninguna acción por ahora.
    }
}