# Linux Commands Reference

*Your personal command reference - built as we go!*

---

## Service Management

### `systemctl`
**What it is:** System Control - manages services/daemons on Linux (systemd)

**Common Usage:**
```bash
sudo systemctl start SERVICE_NAME    # Start a service
sudo systemctl stop SERVICE_NAME     # Stop a service
sudo systemctl restart SERVICE_NAME  # Restart a service
sudo systemctl enable SERVICE_NAME   # Auto-start on boot
sudo systemctl disable SERVICE_NAME  # Don't auto-start on boot
sudo systemctl status SERVICE_NAME   # Check service status
```

**Example:**
```bash
sudo systemctl start postgresql
# Starts the PostgreSQL database service
```

**What's a service/daemon?**
- Background program that runs continuously
- Examples: web servers, databases, SSH server
- Think: Windows Services

---

## User & Permission Commands

### `sudo`
**What it is:** **S**uper **U**ser **DO** - run commands as another user (usually root)

**Why we need it:**
- Some operations require admin (root) privileges
- Security: normal users can't break the system

```bash
sudo COMMAND          # Run command as root
sudo -u USER COMMAND  # Run command as specific user
```

**Flags:**
- `-u USER`: Specify which user to run as

**Example:**
```bash
sudo apt update
# Run apt update as root (admin)

sudo -u postgres psql
# Run psql command as the "postgres" user
```

---

## PostgreSQL Commands

### `psql`
**What it is:** PostgreSQL interactive terminal (REPL)

**Usage:**
```bash
psql                          # Connect as current user
psql -U username              # Connect as specific user
psql -d database_name         # Connect to specific database
sudo -u postgres psql         # Connect as postgres user (common pattern)
```

**Inside psql prompt (`postgres=#`):**
```sql
\l                 -- List all databases
\c database_name   -- Connect to database
\dt                -- List tables
\d table_name      -- Describe table structure
\q                 -- Quit psql
```

---

## Package Management

### `apt`
**What it is:** Package manager for Debian/Ubuntu (like npm for system software)

```bash
sudo apt update              # Update package list
sudo apt upgrade             # Upgrade installed packages
sudo apt install PACKAGE     # Install new package
sudo apt remove PACKAGE      # Remove package
sudo apt search PACKAGE      # Search for package
```

**Example:**
```bash
sudo apt install postgresql
# Download and install PostgreSQL
```

---

## Common Flags Across Commands

### `-u` (User)
Specify which user to run as or operate on
```bash
sudo -u postgres psql        # Run as postgres user
chown -u username file.txt   # Change owner to username
```

### `-y` (Yes)
Auto-confirm prompts (useful for scripts)
```bash
sudo apt install -y postgresql
# Install without asking "Are you sure?"
```

### `-v` (Verbose)
Show detailed output
```bash
ls -v
# List files with more details
```

### `-h` (Help / Human-readable)
```bash
ls -h        # Human-readable file sizes (KB, MB, GB)
command -h   # Show help
```

---

## Process Management

### `ps`
**What it is:** **P**rocess **S**tatus - show running processes

```bash
ps aux           # Show all processes
ps aux | grep NAME  # Find specific process
```

### `kill`
Stop a process
```bash
kill PID         # Gracefully stop process
kill -9 PID      # Force kill
```

---

## File Operations

### Basic Commands
```bash
ls              # List files
ls -la          # List all files (including hidden) with details
cd DIRECTORY    # Change directory
pwd             # Print working directory (where am I?)
mkdir NAME      # Make directory
rm FILE         # Remove file
rm -rf DIR      # Remove directory recursively (BE CAREFUL!)
```

### File Permissions
```bash
chmod 755 FILE  # Change file permissions
chown USER FILE # Change file owner
```

**Permission numbers (chmod):**
- `7` = rwx (read, write, execute)
- `6` = rw- (read, write)
- `5` = r-x (read, execute)
- `4` = r-- (read only)

Example: `chmod 755 script.sh`
- Owner: rwx (7)
- Group: r-x (5)
- Others: r-x (5)

---

## Networking

### SSH
```bash
ssh user@host           # Connect to remote server
ssh -i KEY user@host    # Use specific SSH key
scp FILE user@host:PATH # Copy file to remote server
```

---

## Tips

### Pipe (`|`)
Send output of one command to another
```bash
ls | grep "txt"
# List files, then filter for "txt"
```

### Redirect (`>`)
Save output to file
```bash
ls > files.txt
# Save file list to files.txt
```

### Background (`&`)
Run command in background
```bash
npm run dev &
# Run dev server in background
```

---

*Will be updated as we learn more commands!*
