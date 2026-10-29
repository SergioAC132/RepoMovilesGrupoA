package com.example.sensoresynavdrawer;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;

import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.splashscreen.SplashScreen;
import androidx.drawerlayout.widget.DrawerLayout;

import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.navigation.NavigationView;

public class MainActivity extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener {

    private DrawerLayout drawerLayout;
    private NavigationView navigationView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        SplashScreen.installSplashScreen(this);

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        drawerLayout = findViewById(R.id.drawer_layout);
        navigationView = findViewById(R.id.navigation_view);

        MaterialToolbar toolbar = findViewById(R.id.toolbar);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this,
                drawerLayout,
                toolbar,
                R.string.navigation_drawer_open,
                R.string.navigation_drawer_close
        );

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        navigationView.setNavigationItemSelectedListener(this);
    }

    @Override
    public boolean onNavigationItemSelected(MenuItem item) {

        int id = item.getItemId();

        if (id == R.id.nav_home) {

            // Ya estamos en MainActivity.

        } else if (id == R.id.nav_accelerometer) {

            startActivity(new Intent(
                    this, AccelerometerActivity.class));

        } else if (id == R.id.nav_gyroscope) {

            startActivity(new Intent(
                    this, GyroscopeActivity.class));

        } else if (id == R.id.nav_magnetometer) {

            startActivity(new Intent(
                    this, MagnetometerActivity.class));

        } else if (id == R.id.nav_gps) {

            startActivity(new Intent(
                    this, GpsActivity.class));
        }

        drawerLayout.closeDrawers();

        return true;
    }
}