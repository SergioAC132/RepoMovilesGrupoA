package com.example.sensoresynavdrawer;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import java.util.Locale;
import java.util.Map;

public class GpsActivity extends AppCompatActivity {

    private LocationManager locationManager;

    private TextView txtLatitude;
    private TextView txtLongitude;
    private TextView txtAltitude;
    private TextView txtAccuracy;
    private TextView txtStatus;

    private ActivityResultLauncher<String[]> permissionLauncher;

    private final LocationListener locationListener =
            new LocationListener() {

                @Override
                public void onLocationChanged(Location location) {
                    mostrarUbicacion(location);
                }

                @Override
                public void onProviderEnabled(String provider) {
                    txtStatus.setText("GPS habilitado. Buscando ubicación...");
                }

                @Override
                public void onProviderDisabled(String provider) {
                    txtStatus.setText(
                            "GPS deshabilitado. Activa la ubicación del dispositivo."
                    );
                }
            };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_gps);

        txtLatitude = findViewById(R.id.txtLatitude);
        txtLongitude = findViewById(R.id.txtLongitude);
        txtAltitude = findViewById(R.id.txtAltitude);
        txtAccuracy = findViewById(R.id.txtAccuracy);
        txtStatus = findViewById(R.id.txtGpsStatus);

        locationManager = (LocationManager)
                getSystemService(Context.LOCATION_SERVICE);

        Button btnVolver = findViewById(R.id.btnVolver);
        btnVolver.setOnClickListener(v -> finish());

        Button btnActualizar = findViewById(R.id.btnActualizarGps);
        btnActualizar.setOnClickListener(v -> solicitarUbicacion());

        permissionLauncher = registerForActivityResult(
                new ActivityResultContracts.RequestMultiplePermissions(),
                resultado -> {

                    boolean precisa = Boolean.TRUE.equals(
                            resultado.get(
                                    Manifest.permission.ACCESS_FINE_LOCATION
                            )
                    );

                    boolean aproximada = Boolean.TRUE.equals(
                            resultado.get(
                                    Manifest.permission.ACCESS_COARSE_LOCATION
                            )
                    );

                    if (precisa || aproximada) {
                        iniciarActualizaciones();
                    } else {
                        txtStatus.setText(
                                "Permiso de ubicación denegado."
                        );
                    }
                }
        );
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (tienePermisoUbicacion()) {
            iniciarActualizaciones();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (locationManager != null) {
            locationManager.removeUpdates(locationListener);
        }
    }

    private boolean tienePermisoUbicacion() {

        boolean precisa = ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED;

        boolean aproximada = ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED;

        return precisa || aproximada;
    }

    private void solicitarUbicacion() {

        if (tienePermisoUbicacion()) {
            iniciarActualizaciones();
            return;
        }

        permissionLauncher.launch(new String[]{
                Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.ACCESS_FINE_LOCATION
        });
    }

    private void iniciarActualizaciones() {

        if (!tienePermisoUbicacion()) {
            return;
        }

        boolean gpsHabilitado;

        try {
            gpsHabilitado = locationManager.isProviderEnabled(
                    LocationManager.GPS_PROVIDER
            );
        } catch (Exception e) {
            txtStatus.setText(
                    "No se pudo consultar el estado del GPS."
            );
            return;
        }

        if (!gpsHabilitado) {
            txtStatus.setText(
                    "Activa la ubicación del dispositivo para continuar."
            );
            return;
        }

        try {
            locationManager.requestLocationUpdates(
                    LocationManager.GPS_PROVIDER,
                    2000,
                    1,
                    locationListener
            );

            Location ultimaUbicacion =
                    locationManager.getLastKnownLocation(
                            LocationManager.GPS_PROVIDER
                    );

            if (ultimaUbicacion != null) {
                mostrarUbicacion(ultimaUbicacion);
            }

            txtStatus.setText(
                    "Buscando ubicación mediante GPS..."
            );

        } catch (SecurityException e) {
            txtStatus.setText(
                    "No hay permisos suficientes para acceder al GPS."
            );
        }
    }

    private void mostrarUbicacion(Location location) {

        txtLatitude.setText(String.format(
                Locale.getDefault(),
                "Latitud: %.6f°",
                location.getLatitude()
        ));

        txtLongitude.setText(String.format(
                Locale.getDefault(),
                "Longitud: %.6f°",
                location.getLongitude()
        ));

        if (location.hasAltitude()) {
            txtAltitude.setText(String.format(
                    Locale.getDefault(),
                    "Altitud: %.2f m",
                    location.getAltitude()
            ));
        } else {
            txtAltitude.setText("Altitud: no disponible");
        }

        if (location.hasAccuracy()) {
            txtAccuracy.setText(String.format(
                    Locale.getDefault(),
                    "Precisión estimada: %.1f m",
                    location.getAccuracy()
            ));
        } else {
            txtAccuracy.setText("Precisión: no disponible");
        }

        txtStatus.setText("Ubicación recibida correctamente.");
    }
}