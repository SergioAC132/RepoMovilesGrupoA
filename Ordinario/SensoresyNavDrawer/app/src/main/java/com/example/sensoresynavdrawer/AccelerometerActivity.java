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

public class AccelerometerActivity extends AppCompatActivity
        implements SensorEventListener {

    private SensorManager sensorManager;
    private Sensor acelerometro;

    private TextView txtX, txtY, txtZ;
    private TextView txtMagnitude, txtStatus;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_accelerometer);

        txtX = findViewById(R.id.txtAccelX);
        txtY = findViewById(R.id.txtAccelY);
        txtZ = findViewById(R.id.txtAccelZ);
        txtMagnitude = findViewById(R.id.txtAccelMagnitude);
        txtStatus = findViewById(R.id.txtAccelStatus);

        Button btnVolver = findViewById(R.id.btnVolver);
        btnVolver.setOnClickListener(v -> finish());

        sensorManager = (SensorManager)
                getSystemService(Context.SENSOR_SERVICE);

        acelerometro = sensorManager.getDefaultSensor(
                Sensor.TYPE_ACCELEROMETER
        );

        if (acelerometro == null) {
            txtStatus.setText(
                    "Este dispositivo no tiene acelerómetro disponible."
            );
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (acelerometro != null) {
            boolean registrado = sensorManager.registerListener(
                    this,
                    acelerometro,
                    SensorManager.SENSOR_DELAY_UI
            );

            if (!registrado) {
                txtStatus.setText(
                        "No se pudo registrar el acelerómetro."
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
        if (event.sensor.getType() != Sensor.TYPE_ACCELEROMETER) {
            return;
        }

        float x = event.values[0];
        float y = event.values[1];
        float z = event.values[2];

        double magnitud = Math.sqrt(
                x * x + y * y + z * z
        );

        txtX.setText(String.format(
                Locale.getDefault(),
                "Eje X: %.2f m/s²", x
        ));

        txtY.setText(String.format(
                Locale.getDefault(),
                "Eje Y: %.2f m/s²", y
        ));

        txtZ.setText(String.format(
                Locale.getDefault(),
                "Eje Z: %.2f m/s²", z
        ));

        txtMagnitude.setText(String.format(
                Locale.getDefault(),
                "Magnitud: %.2f m/s²", magnitud
        ));

        txtStatus.setText("Estado: sensor activo");
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // No necesitamos realizar ninguna acción por ahora.
    }
}