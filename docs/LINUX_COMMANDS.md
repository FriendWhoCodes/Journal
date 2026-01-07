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

## Security & Password Management

### Password Generation

#### `openssl rand` (Recommended - Most Secure)
Generate cryptographically secure random passwords

```bash
openssl rand -base64 24        # Generate 24-byte password (base64 encoded)
openssl rand -base64 32        # Generate 32-byte password (more secure)
openssl rand -hex 16           # Generate 16-byte password (hex encoded)
```

**Flags:**
- `-base64`: Encode output as base64 (A-Z, a-z, 0-9, +, /)
- `-hex`: Encode as hexadecimal (0-9, a-f)
- **Number**: Bytes to generate (not final length!)

**Base64 length formula:** bytes × 1.33 = characters
- 24 bytes → ~32 characters
- 32 bytes → ~43 characters

**Example:**
```bash
$ openssl rand -base64 24
Xk9mP3vLn8sWz2fJ1cN5dE4qR7tY6bH0

# This gives you a secure password - copy immediately!
```

---

#### `tr` + `/dev/urandom` (Custom Character Set)
Generate password with specific characters

```bash
# Generate 32-character password with letters, numbers, and symbols
tr -dc 'A-Za-z0-9!@#$%^&*' < /dev/urandom | head -c 32; echo
```

**Breakdown:**
```bash
tr                                  # Translate/delete characters
  -d                               # Delete
  -c 'A-Za-z0-9!@#$%^&*'          # Everything NOT in this set
< /dev/urandom                     # Read from random generator
| head -c 32                       # Take first 32 characters
; echo                             # Add newline at end
```

**Flags:**
- `-d`: Delete characters
- `-c`: Complement (keep only specified chars)

**Character set options:**
```bash
# Only letters and numbers (alphanumeric)
tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32; echo

# With special symbols
tr -dc 'A-Za-z0-9!@#$%^&*()_+-=' < /dev/urandom | head -c 32; echo

# Only numbers (for PIN)
tr -dc '0-9' < /dev/urandom | head -c 6; echo
```

**Example output:**
```bash
$ tr -dc 'A-Za-z0-9!@#$%' < /dev/urandom | head -c 32; echo
Kp8!mQv@3nRz#Y6bN$jW2fL%x9cV5dE1
```

---

#### `sha256sum` + `date` (Quick Method)
Generate from current timestamp

```bash
date +%s | sha256sum | base64 | head -c 32; echo
```

**What it does:**
- `date +%s`: Get current Unix timestamp (seconds since 1970)
- `sha256sum`: Hash the timestamp
- `base64`: Encode hash as base64
- `head -c 32`: Take first 32 characters

**⚠️ Note:** Less secure (predictable if someone knows timestamp), but fine for development/testing.

---

### `/dev/urandom` vs `/dev/random`

**`/dev/urandom`:** (Use this)
- ✅ Never blocks
- ✅ Cryptographically secure
- ✅ Fast

**`/dev/random`:** (Avoid for passwords)
- ❌ Can block if entropy pool is low
- Slightly more random, but unnecessary

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
