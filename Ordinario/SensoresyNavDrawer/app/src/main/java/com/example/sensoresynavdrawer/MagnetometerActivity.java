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

public class MagnetometerActivity extends AppCompatActivity
        implements SensorEventListener {

    private SensorManager sensorManager;
    private Sensor magnetometro;
    private Sensor acelerometro;

    private TextView txtX, txtY, txtZ;
    private TextView txtAzimuth, txtDirection;

    private final float[] gravedad = new float[3];
    private final float[] campoMagnetico = new float[3];

    private final float[] matrizRotacion = new float[9];
    private final float[] orientacion = new float[3];

    private boolean hayGravedad = false;
    private boolean hayCampoMagnetico = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_magnetometer);

        txtX = findViewById(R.id.txtMagX);
        txtY = findViewById(R.id.txtMagY);
        txtZ = findViewById(R.id.txtMagZ);
        txtAzimuth = findViewById(R.id.txtAzimuth);
        txtDirection = findViewById(R.id.txtMagDirection);

        Button btnVolver = findViewById(R.id.btnVolver);
        btnVolver.setOnClickListener(v -> finish());

        sensorManager = (SensorManager)
                getSystemService(Context.SENSOR_SERVICE);

        magnetometro = sensorManager.getDefaultSensor(
                Sensor.TYPE_MAGNETIC_FIELD
        );

        acelerometro = sensorManager.getDefaultSensor(
                Sensor.TYPE_ACCELEROMETER
        );

        if (magnetometro == null || acelerometro == null) {
            txtAzimuth.setText(
                    "Se necesitan magnetómetro y acelerómetro."
            );
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (magnetometro != null) {
            sensorManager.registerListener(
                    this,
                    magnetometro,
                    SensorManager.SENSOR_DELAY_UI
            );
        }

        if (acelerometro != null) {
            sensorManager.registerListener(
                    this,
                    acelerometro,
                    SensorManager.SENSOR_DELAY_UI
            );
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        sensorManager.unregisterListener(this);
    }

    @Override
    public void onSensorChanged(SensorEvent event) {

        if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {

            System.arraycopy(
                    event.values, 0,
                    gravedad, 0, 3
            );

            hayGravedad = true;

        } else if (
                event.sensor.getType() == Sensor.TYPE_MAGNETIC_FIELD
        ) {

            System.arraycopy(
                    event.values, 0,
                    campoMagnetico, 0, 3
            );

            hayCampoMagnetico = true;

            txtX.setText(String.format(
                    Locale.getDefault(),
                    "Campo X: %.2f µT", event.values[0]
            ));

            txtY.setText(String.format(
                    Locale.getDefault(),
                    "Campo Y: %.2f µT", event.values[1]
            ));

            txtZ.setText(String.format(
                    Locale.getDefault(),
                    "Campo Z: %.2f µT", event.values[2]
            ));
        }

        if (hayGravedad && hayCampoMagnetico) {
            actualizarOrientacion();
        }
    }

    private void actualizarOrientacion() {

        boolean exito = SensorManager.getRotationMatrix(
                matrizRotacion,
                null,
                gravedad,
                campoMagnetico
        );

        if (!exito) {
            txtAzimuth.setText(
                    "No se pudo calcular la orientación."
            );
            return;
        }

        SensorManager.getOrientation(
                matrizRotacion,
                orientacion
        );

        float azimut = (float) Math.toDegrees(
                orientacion[0]
        );

        azimut = (azimut + 360) % 360;

        txtAzimuth.setText(String.format(
                Locale.getDefault(),
                "Azimut: %.1f°", azimut
        ));

        String direccion;

        if (azimut >= 337.5 || azimut < 22.5) {
            direccion = "Norte magnético";
        } else if (azimut < 67.5) {
            direccion = "Noreste";
        } else if (azimut < 112.5) {
            direccion = "Este";
        } else if (azimut < 157.5) {
            direccion = "Sureste";
        } else if (azimut < 202.5) {
            direccion = "Sur";
        } else if (azimut < 247.5) {
            direccion = "Suroeste";
        } else if (azimut < 292.5) {
            direccion = "Oeste";
        } else {
            direccion = "Noroeste";
        }

        txtDirection.setText("Dirección: " + direccion);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // No necesitamos realizar ninguna acción por ahora.
    }
}